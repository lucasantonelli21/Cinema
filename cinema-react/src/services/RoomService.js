class RoomService {
  constructor() {
    this.baseURL = 'http://localhost:3000';
  }

  async findAll() {
    try {
      const response = await fetch(`${this.baseURL}/room`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching rooms: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('RoomService.findAll error:', error);
      throw error;
    }
  }

  async findOne(id) {
    try {
      const response = await fetch(`${this.baseURL}/room/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching room: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('RoomService.findOne error:', error);
      throw error;
    }
  }

  async create(roomData) {
    try {
      
      // Mapeamento correto baseado no schema Prisma (só capacidade e tipo)
      const mappedData = {
        capacidade: Number(roomData.capacity) || 0,
        tipo: String(roomData.type || '').trim()
      };
      
      // Validar se os campos obrigatórios não estão vazios
      if (!mappedData.capacidade || mappedData.capacidade <= 0) {
        throw new Error('Capacidade deve ser maior que 0');
      }
      if (!mappedData.tipo) {
        throw new Error('Tipo da sala é obrigatório');
      }
      
      const response = await fetch(`${this.baseURL}/room`, {
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
        throw new Error(`Error creating room: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('RoomService.create error:', error);
      throw error;
    }
  }

  async update(id, roomData) {
    try {
      // Mapeamento correto baseado no schema Prisma (só capacidade e tipo)
      const mappedData = {
        capacidade: Number(roomData.capacity) || 0,
        tipo: String(roomData.type || '').trim()
      };
      
      const response = await fetch(`${this.baseURL}/room/${id}`, {
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
        throw new Error(`Error updating room: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('RoomService.update error:', error);
      throw error;
    }
  }

  async remove(id) {
    try {
      const response = await fetch(`${this.baseURL}/room/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error removing room: ${response.status} ${response.statusText}`);
      }
      
      // Tentar fazer JSON, mas se falhar, retornar sucesso
      try {
        return await response.json();
      } catch (jsonError) {
        // Se não conseguir fazer JSON (resposta vazia), considerar sucesso
        return { message: 'Room deleted successfully', success: true };
      }
    } catch (error) {
      console.error('RoomService.remove error:', error);
      throw error;
    }
  }
}

export default new RoomService();