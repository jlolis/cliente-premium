export const isPremium = async (Propz: any, clientId: string) => {
  if (!clientId) {
    return 'envie o CPF como parametro após a URL ex: ?clientId=4'
  }

  try {
    const response = await Propz.isPremiumClient(clientId)

    if (response.data.aceites >= 4) {
      return true
    }

    return false
  } catch (error) {
    console.error(error)

    return 1000 // 1000 quer dizer que não encontrou o cpf cadastrado na base
  }
}

export const isPremiumCpf = async (Propz: any, clientId: string) => {
  if (!clientId) {
    return 'envie o CPF como parametro após a URL ex: ?clientId=4'
  }

  try {
    const response = await Propz.isPremiumClient(clientId)

    return response.data.id_cliente
  } catch (error) {
    console.error(error)

    return error // quer dizer que não encontrou o cpf cadastrado
  }
}

export const updateIsPremiumCpf = async (Propz: any, clientId: string) => {
  if (!clientId) {
    return 'envie o CPF como parametro após a URL ex: ?clientId=4'
  }

  try {
    const response = await Propz.isPremiumClient(clientId)

    if (response.data.id_cliente) {
      // colocar chamada para update pelo id
      const response2 = await Propz.updateAcceptsPremiumClient(
        response.data.id_cliente
      )

      return response2
    }

    return 'Erro no response.data.id_cliente'
  } catch (error) {
    console.error(error)

    return error // quer dizer que não encontrou o cpf cadastrado
  }
}

export const zendeskForm = async (Propz: any, clientId: string) => {
  if (!clientId) {
    return 'envie o CPF como parametro após a URL ex: ?clientId=4'
  }

  try {
    const response = await Propz.isPremiumClient(clientId)

    if (response.data.id_cliente) {
      // colocar chamada para update pelo id
      const response2 = await Propz.sendZendeskForm(response.data.id_cliente)

      return response2
    }

    return 'Erro no response.data.id_cliente'
  } catch (error) {
    console.error(error)

    return error // quer dizer que não encontrou o cpf cadastrado
  }
}

export const createNewPremium = async (
  Propz: any,
  dadosnovocliente: string
) => {
  if (!dadosnovocliente) {
    return 'envie os dados como parametro sem espaços, caso precise utilizar o &nbsp após a URL ex: ?dadosnovocliente={"cpf":20099913038,"name":"TestePremium","street":"Travessa&nbspMestre&nbspJúlio","city":"Teófilo&nbspOtoni","neighborhood":"Altino&nbspBarbosa","birthDate":"1983-05-15","genre":"M","phone":"96994661747","number":"878","cep":"68905513","email":"20099913038teste@teste.premium","complement":"Casa","uf":"MG"}'
  }

  try {
    const response = await Propz.CreatePremiumClient(dadosnovocliente)

    if (response) {
      return response
    }

    return 'Erro no response.data.id_cliente'
  } catch (error) {
    console.error(error)

    return error // quer dizer que não encontrou o cpf cadastrado
  }
}

export const allPromoPropz = async (Propz: any, clientId: string) => {
  if (!clientId) {
    return 'envie o CPF como parametro após a URL ex: ?clientId=4'
  }

  try {
    const response = await Propz.getAllPropzPromo(clientId)

    return response
  } catch (error) {
    console.error(error)

    return 1000 // 1000 quer dizer que não encontrou o cpf cadastrado na base
  }
}
