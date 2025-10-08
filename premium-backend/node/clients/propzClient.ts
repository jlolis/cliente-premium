/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line prettier/prettier
import type { IOContext, InstanceOptions } from '@vtex/api'
import { ExternalClient } from '@vtex/api'
import btoa from 'btoa'

export default class PropzClient extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('', context, {
      ...options,
      retries: 2,
    })
  }

  public async checkFields(fields: any[]) {
    try {
      return fields.every(
        field => field !== undefined && field !== '' && field != null
      )
    } catch (err) {
      return { error: err }
    }
  }

  private getAuthHeader(username: string, password: string) {
    return `Basic ${btoa(`${username}:${password}`)}`
  }

  // eslint-disable-next-line max-params
  public async getPromotionShowCase(
    domain: string,
    token: string,
    document: number,
    username: string,
    password: string,
    storeId: string
  ) {
    const auth = this.getAuthHeader(username, password)

    try {
      return this.http.get(
        `https://${domain}/v1/databases/${token}/retail/promotion-showcase/${document}?channel=ecom&storeId=${storeId}`,
        {
          metric: 'getPromotionShowcase',
          nullIfNotFound: true,
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      return error
    }
  }

  // eslint-disable-next-line max-params
  public async getAllPromotion(
    domain: string,
    token: string,
    username: string,
    password: string,
    storeId: string,
    page: number
  ) {
    const auth = this.getAuthHeader(username, password)

    const limit = 100
    const actialOffset = (page - 1) * limit

    try {
      return this.http.get(
        `https://${domain}/v1/databases/${token}/retail/promotions?valid=true&limit=${limit}&offset=${actialOffset}&channel=ecom&storeId=${storeId}`,
        {
          metric: 'getAllPromotion',
          nullIfNotFound: true,
          headers: {
            Authorization: auth,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      return error
    }
  }

  // eslint-disable-next-line max-params
  public async isPremiumClient(clientId: string) {
    try {
      return this.http.get(
        `https://hml-apibic.farmaciaindiana.com.br/api/v2/customers/${clientId}?cpf=1`,
        {
          headers: {
            'x-api-key':
              '$2y$10$f6mnrySoOXxLwxpQ4xGt8OrlkLVNsV7UNUoVr.pVOm8ZWT6Wbx8z.',
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      return error
    }
  }

  // eslint-disable-next-line max-params
  public async updateAcceptsPremiumClient(clientId: string) {
    try {
      const response = await this.http.patch(
        `https://hml-apibic.farmaciaindiana.com.br/api/v2/customers/${clientId}`,
        { accepts: true },
        {
          headers: {
            'x-api-key':
              '$2y$10$f6mnrySoOXxLwxpQ4xGt8OrlkLVNsV7UNUoVr.pVOm8ZWT6Wbx8z.',
            'Content-Type': 'application/json',
          },
        }
      )

      return response
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      throw error // ou retorne se preferir
    }
  }

  // eslint-disable-next-line max-params
  public async CreatePremiumClient(dadosnovocliente: string) {
    const decoded = decodeURIComponent(dadosnovocliente) // Garante que esteja legível
    const objDados = JSON.parse(decoded) // Agora você tem o objeto original

    try {
      const response = await this.http.post(
        `https://hml-apibic.farmaciaindiana.com.br/api/v2/customers`,
        {
          cpf: objDados.cpf,
          name: objDados.name,
          street: objDados.street,
          city: objDados.city,
          neighborhood: objDados.neighborhood,
          birthDate: objDados.birthDate,
          genre: objDados.genre,
          phone: objDados.phone,
          number: objDados.number,
          cep: objDados.cep,
          email: objDados.email,
          complement: objDados.complement,
          uf: objDados.uf,
          accepts: true,
          legacyCode: objDados.cpf,
        },
        {
          headers: {
            'x-api-key':
              '$2y$10$f6mnrySoOXxLwxpQ4xGt8OrlkLVNsV7UNUoVr.pVOm8ZWT6Wbx8z.',
            'Content-Type': 'application/json',
          },
        }
      )

      return response
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      throw error // ou retorne se preferir
    }
  }

  // eslint-disable-next-line max-params
  public async postVerifyPurchase(
    domain: string,
    token: string,
    username: string,
    password: string,
    itemsCart: any
  ) {
    const auth = this.getAuthHeader(username, password)

    return this.http.post(
      `https://${domain}/v1/databases/${token}/retail/pos/verify-purchase/v2`,
      JSON.stringify(itemsCart),
      {
        metric: 'postVerifyPurchase',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
      }
    )
  }

  // eslint-disable-next-line max-params
  public async postRegisterPurchase(
    domain: string,
    token: string,
    username: string,
    password: string,
    itemsCart: any
  ) {
    const auth = this.getAuthHeader(username, password)

    return this.http.post(
      `https://${domain}/v1/databases/${token}/retail/pos/register-purchase/v2`,
      JSON.stringify(itemsCart),
      {
        metric: 'postRegisterPurchase',
        headers: {
          Authorization: auth,
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
