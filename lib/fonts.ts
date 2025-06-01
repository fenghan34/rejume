import {
  Nunito_Sans,
  Noto_Sans,
  Noto_Sans_SC,
  Montserrat,
} from 'next/font/google'

export const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
  preload: true,
  fallback: [],
})

export const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
  preload: true,
  fallback: [],
})

export const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  display: 'swap',
  preload: true,
  fallback: [],
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  style: ['normal'],
  weight: '700',
  display: 'swap',
})
