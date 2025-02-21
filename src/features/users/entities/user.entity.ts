import { Column, DeepPartial, Entity } from "typeorm";
import { CommonEntityFields } from "../../../utils/entities/common-entity-fields";
import { Exclude } from "class-transformer";

@Entity()
export class User extends CommonEntityFields {
    constructor(partial: DeepPartial<User>) {
        super();
        Object.assign(this, partial);
    }

    @Column({ length: 200, nullable: true })
    firstName: string;

    @Column({ length: 200, nullable: true })
    lastName: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column({
        unique: true,
        nullable: true,
    })
    phoneNumber: string;

    @Column({ nullable: true })
    @Exclude()
    password: string;
}