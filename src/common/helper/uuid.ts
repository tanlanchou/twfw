import { v4 as uuidv4 } from 'uuid';

export function generateID(): string {
    let id = uuidv4();
    console.log(id);
    return id;
}