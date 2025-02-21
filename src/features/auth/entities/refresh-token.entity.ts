import { Column, DeepPartial, Entity } from "typeorm";
import { CommonEntityFields } from "../../../utils/entities/common-entity-fields";

@Entity()
export class RefreshToken extends CommonEntityFields {
    constructor(partial: DeepPartial<RefreshToken>) {
        super();
        Object.assign(this, partial);
    }

    @Column({
        unique: true,
        length: 255,
    })
    token: string;
}