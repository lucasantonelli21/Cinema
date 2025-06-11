class TicketService {
  constructor() {
    this.baseURL = 'http://localhost:3000';
  }

  async findAll() {
    try {
      const response = await fetch(`${this.baseURL}/ticket`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching tickets: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TicketService.findAll error:', error);
      throw error;
    }
  }

  async findOne(id) {
    try {
      const response = await fetch(`${this.baseURL}/ticket/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching ticket: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TicketService.findOne error:', error);
      throw error;
    }
  }

  async create(ticketData) {
    try {
      
      // Mapeamento para português conforme o DTO
      const mappedData = {
        session_id: Number(ticketData.sessionId),
        cpf: String(ticketData.cpf || '').trim(),
        assento: String(ticketData.seat || '').trim(),
        formaPagamento: String(ticketData.paymentMethod || '').trim()
      };
      
      const response = await fetch(`${this.baseURL}/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(mappedData),
      });
      
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('🚨 Erro do servidor:', errorData);
        throw new Error(`Error creating ticket: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('TicketService.create error:', error);
      throw error;
    }
  }

  async update(id, ticketData) {
    try {
      // Mapeamento para português conforme o DTO
      const mappedData = {
        session_id: Number(ticketData.sessionId),
        cpf: String(ticketData.cpf || '').trim(),
        assento: String(ticketData.seat || '').trim(),
        formaPagamento: String(ticketData.paymentMethod || '').trim()
      };
      
      const response = await fetch(`${this.baseURL}/ticket/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(mappedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('🚨 Erro do servidor:', errorData);
        throw new Error(`Error updating ticket: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TicketService.update error:', error);
      throw error;
    }
  }

  async remove(id) {
    try {
      const response = await fetch(`${this.baseURL}/ticket/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error removing ticket: ${response.status} ${response.statusText}`);
      }
      
      // Tentar fazer JSON, mas se falhar, retornar sucesso
      try {
        return await response.json();
      } catch (jsonError) {
        // Se não conseguir fazer JSON (resposta vazia), considerar sucesso
        return { message: 'Ticket deleted successfully', success: true };
      }
    } catch (error) {
      console.error('TicketService.remove error:', error);
      throw error;
    }
  }
}

export default new TicketService();