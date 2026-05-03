import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

const COUPONS: Record<string, { discount: number; maxUses: number; description: string }> = {
  MAY20: { discount: 20, maxUses: 10, description: '20% off for first 10 users' },
}

export async function POST(req: NextRequest) {
  try {
    const { code, amount_paise } = await req.json()
    const normalized = (code || '').toString().toUpperCase().trim()

    const coupon = COUPONS[normalized]
    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' })
    }

    const supabase = createServiceRoleClient()
    const { count } = await supabase
      .from('coupon_uses')
      .select('*', { count: 'exact', head: true })
      .eq('coupon_code', normalized)

    if ((count ?? 0) >= coupon.maxUses) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired' })
    }

    const finalAmount = Math.round((amount_paise ?? 0) * (1 - coupon.discount / 100))

    return NextResponse.json({
      valid: true,
      discount_percent: coupon.discount,
      final_amount_paise: finalAmount,
      message: `${normalized} applied — ${coupon.discount}% additional off!`,
    })
  } catch (err) {
    console.error('[apply-coupon]', err)
    return NextResponse.json({ valid: false, message: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
