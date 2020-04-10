const Type = <Dest>() => <
    T extends {
        [k: string]: Dest;
    }
>(
    config: T
): {
    [k in keyof T & string]: Dest;
    // get: (key:string) => (Dest | undefined);
} & {
    get: (key: string) => Dest | undefined;
    keys: () => (keyof T)[];
    values: () => Dest[];
    entries: () => [keyof T, Dest][];
} => {
    return Object.keys(config).reduce(
        (acc, key) => ({
            ...acc,
            [key]: config[key],
        }),
        {
            get(key: string) {
                if (key in config) {
                    return config[key];
                }
                return;
            },
            keys() {
                return Object.keys(config);
            },
            values() {
                return Object.values(config);
            },
            entries() {
                return Object.entries(config);
            },
        }
    ) as any;
};

export default Type;
