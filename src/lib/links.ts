/** A link is "live" once the [PLACEHOLDER] in content.ts has been replaced with a real URL. */
export const isLive = (v: string | undefined): v is string => !!v && !v.startsWith("[");
