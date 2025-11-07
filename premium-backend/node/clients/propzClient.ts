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

  public async sendZendeskForm(assunto: string, comentario: string) {
    const username = 'suporteti@farmaciaindiana.com.br'
    const password = 'DINW7WgQSfXxMvTHlG3LeIv70ZOKTpsf3baSsym0'
    const basicAuth = btoa(`${username}/token:${password}`)

    try {
      const response = await this.http.post(
        `https://farmaciaindiana.zendesk.com/api/v2/tickets/`,
        {
          ticket: {
            comment: {
              body: comentario,
            },
            priority: 'urgent',
            subject: assunto,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`,
          },
        }
      )

      return {
        success: true,
        message: 'Ticket criado com sucesso!',
        data: response,
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro ao criar ticket: ${error}`,
      }
    }
  }

  // eslint-disable-next-line max-params
  public async CreatePremiumClient(dadosnovocliente: string) {
    const decoded = decodeURIComponent(dadosnovocliente)
    const objDados = JSON.parse(decoded)

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
      throw error
    }
  }

  // eslint-disable-next-line max-params
  public async getAllPropzPromo(clientId: string) {
    const username = '033e26d6-f21e-4028-a6a0-53e75a2f7776'
    const password = '608ed2ff-9ee8-4c38-a32f-e3fd447b6f65'
    const basicAuth = btoa(`${username}:${password}`)

    try {
      return this.http.get(
        `https://propzcloud.pzm.vc/v1/databases/0062bdd4-d728-466d-9396-92a8eea97f33/retail/promotion-showcase/${clientId}`,
        {
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      return error
    }
  }
}
