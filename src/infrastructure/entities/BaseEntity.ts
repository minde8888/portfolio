import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ 
        type: 'timestamp',
        nullable: true 
    })
    createdAt!: Date | null;

    @UpdateDateColumn({ 
        type: 'timestamp',
        nullable: true 
    })
    updatedAt!: Date | null;
}