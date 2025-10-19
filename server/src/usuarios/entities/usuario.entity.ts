import { Column, CreateDateColumn } from "typeorm";

export class Usuario {
    @Column({ primary: true, generated: true})
    id: number;

    @Column({ unique: true })
    rut: string;

    @Column()
    nombre: string;

    @Column()
    apellidos: string;

    @Column({ unique: true })
    correo: string;

    @Column({ nullable: true })
    telefono: string;
  
    @Column({ nullable: true })
    anexo: string;

    @Column({ default: true })
    estado: boolean; 

    @Column({ default: false })
    esJefe: boolean;
    
    @Column({ nullable: true })
    foto_url: string;
    
    @Column({ nullable: true })
    url_horario: string;

    @CreateDateColumn()
    fecha_creacion: Date;

    

}
