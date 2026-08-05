import { Exclude, Expose, Transform } from "class-transformer";
import { MembershipType } from "../technician.entity";
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ResponseTechnicianDto {
  @Expose()
  @ApiProperty()
  specialization: string;
  @Expose()
  @Transform(({ obj }) => Array.isArray(obj.services) ? obj.services.map((s: any) => s.name) : [])
  @ApiProperty({ type: [String] })
  services: string[];
  @Expose()
  @ApiProperty()
  id: number
  @Expose()
  @ApiProperty()
  latitude: number;
  @Expose()
  @ApiProperty()
  longitude: number;
  @Expose()
  @Transform(({ obj }) => obj.user.username)
  @ApiProperty()
  username: string;
  @Expose()
  @Transform(({ obj }) => obj.user.firstName)
  @ApiProperty()
  firstName: string;
  @Expose()
  @Transform(({ obj }) => obj.user.lastName)
  @ApiProperty()
  lastName: string;
  @Expose()
  @Transform(({ obj }) => obj.user.phone)
  @ApiProperty()
  phone: string;
  @Expose()
  @Transform(({ obj }) => obj.user.email)
  @ApiProperty()
  email: string;
  @Expose()
  @Transform(({ obj }) => obj.user.address)
  @ApiProperty()
  address: string;
  @Expose()
  @Transform(({ obj }) => obj.user.profilePhotoUrl)
  @ApiProperty({ required: false, nullable: true })
  profilePhotoUrl?: string | null;

  // Membership
  @Expose()
  @ApiProperty({ enum: MembershipType })
  membershipType: MembershipType;
  @Expose()
  @ApiProperty()
  membershipActive: boolean;
  @Expose()
  @ApiProperty({ required: false, nullable: true })
  membershipStartedAt?: Date | null;
  @Expose()
  @ApiProperty({ required: false, nullable: true })
  membershipExpiresAt?: Date | null;

  @Expose()
  @ApiProperty({ description: 'Promedio de calificaciones (0.00 - 5.00)', example: 4.35 })
  averageRating: number;
}