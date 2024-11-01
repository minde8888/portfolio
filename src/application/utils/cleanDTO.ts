export function cleanDTO<T>(dto: T): Partial<T> {
    const cleanedDTO: Partial<T> = { ...dto };
    Object.keys(cleanedDTO).forEach((key) => {
        const value = (cleanedDTO as any)[key];
        if (value === null || value === undefined || value === '') {
            delete (cleanedDTO as any)[key];
        }
    });
    return cleanedDTO;
}