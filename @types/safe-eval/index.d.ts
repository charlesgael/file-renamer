declare module "safe-eval" {
    const safeEval: (code: string, context: object) => any;

    export default safeEval;
}
