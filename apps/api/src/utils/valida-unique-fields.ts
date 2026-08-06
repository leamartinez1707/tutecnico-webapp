import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export async function validateUniqueUserFields(
  usersRepository: Repository<User>,
  username?: string,
  email?: string,
  phone?: string,
  userId?: number,
): Promise<void> {
  const conditions: { username?: string; email?: string; phone?: string }[] = [];
  if (username) conditions.push({ username });
  if (email) conditions.push({ email });
  if (phone) conditions.push({ phone });

  if (conditions.length === 0) return;

  const existingUser = await usersRepository.findOne({ where: conditions });

  if (existingUser && existingUser.id !== userId) {
    if (username && existingUser.username === username) {
      throw new HttpException('El nombre de usuario ya está en uso', HttpStatus.CONFLICT);
    }
    if (email && existingUser.email === email) {
      throw new HttpException('El email ya está en uso', HttpStatus.CONFLICT);
    }
    if (phone && existingUser.phone === phone) {
      throw new HttpException('El teléfono ya está en uso', HttpStatus.CONFLICT);
    }
  }
}
