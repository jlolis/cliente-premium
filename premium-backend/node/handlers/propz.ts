import {
  isPremium,
  isPremiumCpf,
  updateIsPremiumCpf,
  createNewPremium,
  allPromoPropz,
  zendeskForm,
} from '../utils/collection/isPremium'

export async function getIsPremium(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz },
  } = ctx

  const { clientId } = ctx.query

  const { query } = ctx.request

  try {
    const data = await isPremium(Propz, clientId)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    // console.log('É premium? ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function getIsPremiumCpf(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz },
  } = ctx

  const { clientId } = ctx.query

  const { query } = ctx.request

  try {
    const data = await isPremiumCpf(Propz, clientId)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    // console.log('É premium? ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function setUpdateIsPremiumCpf(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz },
  } = ctx

  const { clientId } = ctx.query

  const { query } = ctx.request

  try {
    const data = await updateIsPremiumCpf(Propz, clientId)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    // console.log('Atualizou ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function setzendeskForm(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz },
  } = ctx

  const { clientId } = ctx.query

  const { query } = ctx.request

  try {
    const data = await zendeskForm(Propz, clientId)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    // console.log('Atualizou ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function postCreateNewPremium(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { Propz },
  } = ctx

  const { dadosnovocliente } = ctx.query

  const { query } = ctx.request

  try {
    const data = await createNewPremium(Propz, dadosnovocliente)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    // console.log('Cadastrou ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}

export async function getAllPromoPropz(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { Propz },
  } = ctx

  const { clientId } = ctx.query

  const { query } = ctx.request

  try {
    const data = await allPromoPropz(Propz, clientId)

    ctx.status = 200
    ctx.body = query.showcase && query.showcase === 'true' ? data : data

    // console.log('Promo Propz: ', ctx.body)
  } catch (error) {
    ctx.status = 400
    ctx.body = error
  }

  ctx.set('cache-control', 'no-cache')
  await next()
}
