declare module 'dayjs' {
  type ConfigType = string | number | Date | null | undefined

  interface DayjsInstance {
    format(pattern?: string): string
    isValid(): boolean
  }

  type ParseFormat = string | string[]

  function dayjs(
    config?: ConfigType,
    format?: ParseFormat,
    strict?: boolean
  ): DayjsInstance

  namespace dayjs {}

  export default dayjs
}
