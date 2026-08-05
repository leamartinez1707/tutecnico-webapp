import { ApiProperty } from '@nestjs/swagger';

class UserSummaryDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    username: string;
    @ApiProperty({ required: false, nullable: true })
    profilePhotoUrl?: string | null;
}

class TechnicianSummaryDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    username: string; // sourced from technician.user.username
    @ApiProperty()
    specialization: string;
    @ApiProperty({ type: [String] })
    services: string[]; // names only
    @ApiProperty({ required: false, nullable: true })
    profilePhotoUrl?: string | null; // technician.user.profilePhotoUrl
}

export class ResponseBookingsDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    date: Date;
    @ApiProperty()
    comment: string;
    @ApiProperty()
    status: string;
    @ApiProperty({ type: () => UserSummaryDto })
    user: UserSummaryDto;
    @ApiProperty({ type: () => TechnicianSummaryDto })
    technician: TechnicianSummaryDto;
}

export { UserSummaryDto, TechnicianSummaryDto };