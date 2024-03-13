import logo from '@/assets/logo/logo.png'
import ccLogo from '@/assets/logo/cc_logo.png'

const isYunTest = process.env.NODE_ENV === 'company_production_test'

export const appTitle = isYunTest ? '超材智能 - PAD' : '海纳 - PAD'
export const appName = isYunTest ? '' : '海纳长晶MES'
export const appLogo = isYunTest ? ccLogo : logo

document.title = appTitle
