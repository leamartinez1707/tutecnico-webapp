import 'reflect-metadata';
import DbConfig from '../config/db.config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/user.entity';
import { Technician, MembershipType } from '../technicians/technician.entity';
import { Service } from '../services/service.entity';
import { Review } from '../reviews/entities/review.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { randomAddress, randomLatLngForCity } from './uy-addresses';

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function chance(prob: number, rnd: () => number) {
  return rnd() < prob;
}

// Services and professions are expected to be preloaded; do not create new ones here.

function randomName(rnd: () => number) {
  const first = ['Juan', 'María', 'José', 'Ana', 'Luis', 'Lucía', 'Carlos', 'Sofía', 'Martín', 'Valentina', 'Diego', 'Camila'];
  const last = ['García', 'Rodríguez', 'González', 'Pérez', 'Fernández', 'López', 'Martínez', 'Silva', 'Santos', 'Suárez', 'Castro'];
  return { firstName: pickOne(first, rnd), lastName: pickOne(last, rnd) };
}

function randomComment(rnd: () => number) {
  const templates = [
    'Excelente servicio, muy recomendable.',
    'Llegó a tiempo y solucionó el problema.',
    'Podría mejorar la puntualidad, pero buen trabajo.',
    'Muy profesional y amable.',
    'Calidad-precio justa, volvería a contratar.',
    'No quedé conforme, tuvo que volver.',
    'Trabajo prolijo y rápido.',
  ];
  return pickOne(templates, rnd);
}

function randomDateInRange(rnd: () => number, start: Date, end: Date) {
  const s = start.getTime();
  const e = end.getTime();
  const t = s + Math.floor(rnd() * (e - s));
  return new Date(t);
}

async function main() {
  const seed = Number(process.env.SEED || 12345);
  const rnd = mulberry32(seed);
  await DbConfig.initialize();
  const dataSource = DbConfig;
  const userRepo = dataSource.getRepository(User);
  const techRepo = dataSource.getRepository(Technician);
  const serviceRepo = dataSource.getRepository(Service);
  const reviewRepo = dataSource.getRepository(Review);
  const bookingRepo = dataSource.getRepository(Booking);

  // Use existing services from DB; no creation here
  const allServices = await serviceRepo.find({ order: { name: 'ASC' } });
  
  // Load professions from DB to assign realistic specializations
  const allProfessions = await dataSource.query(
    'SELECT p.id, p.name, p.service_id FROM profession p'
  ) as Array<{ id: number; name: string; service_id: number }>;

  const normalUsersCount = Number(process.env.SEED_USERS || 5000);
  const techniciansCount = Number(process.env.SEED_TECHS || 2000);
  const reviewsCount = Number(process.env.SEED_REVIEWS || 1500);
  const bookingsCount = Number(process.env.SEED_BOOKINGS || 1500);

  const passwordHash = await bcrypt.hash(process.env.SEED_PASSWORD || 'Password123!', 10);

  console.log(`Seeding ~${normalUsersCount + techniciansCount + reviewsCount + bookingsCount} records...`);

  // 1) Normal Users
  console.time('users');
  const userBatchSize = 1000;
  for (let offset = 0; offset < normalUsersCount; offset += userBatchSize) {
    const batch: User[] = [];
    const end = Math.min(offset + userBatchSize, normalUsersCount);
    for (let i = offset + 1; i <= end; i++) {
      const { firstName, lastName } = randomName(rnd);
      const { address } = randomAddress(rnd);
      const u = userRepo.create({
        username: `user${i}`,
        firstName,
        lastName,
        email: `user${i}@example.com`,
        password: passwordHash,
        phone: `09${(1000000 + i).toString().slice(-7)}`,
        address,
        isActive: true,
        role: UserRole.USUARIO,
        emailVerified: chance(0.6, rnd),
        emailVerificationToken: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        profilePhotoUrl: null,
      });
      batch.push(u);
    }
    await userRepo.save(batch);
    console.log(`Inserted users ${offset + 1}-${end}`);
  }
  console.timeEnd('users');

  // 2) Technicians + their User (cascade)
  console.time('technicians');
  // Derive technician specialization from assigned service to keep consistency
  const techBatchSize = 500;
  for (let offset = 0; offset < techniciansCount; offset += techBatchSize) {
    const batch: Technician[] = [];
    const end = Math.min(offset + techBatchSize, techniciansCount);
    for (let i = offset + 1; i <= end; i++) {
      const { firstName, lastName } = randomName(rnd);
      const addr = randomAddress(rnd);
      const coords = randomLatLngForCity(addr.city, rnd);
      const u = userRepo.create({
        username: `tech${i}`,
        firstName,
        lastName,
        email: `tech${i}@example.com`,
        password: passwordHash,
        phone: `09${(7000000 + i).toString().slice(-7)}`,
        address: addr.address,
        isActive: true,
        role: UserRole.TECNICO,
        emailVerified: chance(0.7, rnd),
        emailVerificationToken: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        profilePhotoUrl: null,
      });
      const tech = techRepo.create({
        // specialization will be set after selecting services
        specialization: '',
        latitude: coords.lat,
        longitude: coords.lng,
        user: u,
        services: [],
        membershipType: chance(0.2, rnd) ? MembershipType.PAID : (chance(0.2, rnd) ? MembershipType.TRIAL : MembershipType.NONE),
        membershipActive: false,
        membershipStartedAt: null,
        membershipExpiresAt: null,
      });
      // Assign 1-3 random services
      const svcCount = 1 + Math.floor(rnd() * 3);
      const shuffled = [...allServices].sort(() => rnd() - 0.5);
      tech.services = shuffled.slice(0, Math.min(svcCount, allServices.length));
      
      // Set specialization to a profession that matches one of the assigned services
      if (tech.services.length > 0) {
        const primaryService = tech.services[0];
        const matchingProfessions = allProfessions.filter(p => p.service_id === primaryService.id);
        if (matchingProfessions.length > 0) {
          tech.specialization = pickOne(matchingProfessions, rnd).name;
        } else {
          // Fallback to service name if no profession found
          tech.specialization = primaryService.name;
        }
      } else {
        // Fallback: if no services exist in DB, skip technician to avoid inconsistency
        continue;
      }

      // Set membership dates if active
      if (tech.membershipType !== MembershipType.NONE) {
        tech.membershipActive = true;
        const now = new Date();
        tech.membershipStartedAt = now;
        const months = tech.membershipType === MembershipType.PAID ? (1 + Math.floor(rnd() * 6)) : 1;
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + months);
        tech.membershipExpiresAt = endDate;
      }
      batch.push(tech);
    }
    await techRepo.save(batch);
    console.log(`Inserted technicians ${offset + 1}-${end}`);
  }
  console.timeEnd('technicians');

  // Fetch ids to associate
  const allUserIds = (await userRepo.find({ select: ['id'], where: { role: UserRole.USUARIO } })).map(u => u.id);
  const allTechIds = (await techRepo.find({ select: ['id'] })).map(t => t.id);

  // 3) Reviews
  console.time('reviews');
  const reviewBatchSize = 1000;
  for (let offset = 0; offset < reviewsCount; offset += reviewBatchSize) {
    const batch: Review[] = [];
    const end = Math.min(offset + reviewBatchSize, reviewsCount);
    for (let i = offset + 1; i <= end; i++) {
      const userId = pickOne(allUserIds, rnd);
      const techId = pickOne(allTechIds, rnd);
      const r = reviewRepo.create({
        rating: 1 + Math.floor(rnd() * 5),
        comment: randomComment(rnd),
        date: randomDateInRange(rnd, new Date(Date.now() - 365 * 24 * 3600 * 1000), new Date()),
        user: { id: userId } as any,
        technician: { id: techId } as any,
      });
      batch.push(r);
    }
    await reviewRepo.save(batch);
    console.log(`Inserted reviews ${offset + 1}-${end}`);
  }
  console.timeEnd('reviews');

  // 4) Bookings
  console.time('bookings');
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  const bookingBatchSize = 1000;
  for (let offset = 0; offset < bookingsCount; offset += bookingBatchSize) {
    const batch: Booking[] = [];
    const end = Math.min(offset + bookingBatchSize, bookingsCount);
    for (let i = offset + 1; i <= end; i++) {
      const userId = pickOne(allUserIds, rnd);
      const techId = pickOne(allTechIds, rnd);
      const isPast = chance(0.6, rnd);
      const date = isPast
        ? randomDateInRange(rnd, new Date(Date.now() - 180 * 24 * 3600 * 1000), new Date())
        : randomDateInRange(rnd, new Date(), new Date(Date.now() + 60 * 24 * 3600 * 1000));
      const b = bookingRepo.create({
        date,
        status: pickOne(statuses, rnd),
        comment: chance(0.5, rnd) ? randomComment(rnd) : '',
        user: { id: userId } as any,
        technician: { id: techId } as any,
      });
      batch.push(b);
    }
    await bookingRepo.save(batch);
    console.log(`Inserted bookings ${offset + 1}-${end}`);
  }
  console.timeEnd('bookings');

  console.log('Seeding complete.');
  await DbConfig.destroy();
}

main().catch(async (err) => {
  console.error('Seeder error:', err);
  try { await DbConfig.destroy(); } catch {}
  process.exit(1);
});
