import { Certificate, Database, Flask, Handshake, Lighthouse, Scales, SealCheck, Stack } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import type { AuthorityClass } from '../../types'

export const authorityIcons: Record<AuthorityClass, Icon> = {
  law: Scales,
  treaty: Handshake,
  'policy-guidance': Lighthouse,
  standard: Certificate,
  'assurance-standard': SealCheck,
  framework: Stack,
  'testing-tool': Flask,
  'research-database': Database,
}
