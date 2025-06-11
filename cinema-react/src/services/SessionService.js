class SessionService {
  constructor() {
    this.baseURL = 'http://localhost:3000';
  }

  async findAll() {
    try {
      const response = await fetch(`${this.baseURL}/session`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching sessions: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('SessionService.findAll error:', error);
      throw error;
    }
  }

  async findOne(id) {
    try {
      const response = await fetch(`${this.baseURL}/session/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching session: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('SessionService.findOne error:', error);
      throw error;
    }
  }

  async create(sessionData) {
    try {
      
      // Mapeamento para português conforme o DTO
      const mappedData = {
        movie_id: Number(sessionData.movieId),
        room_id: Number(sessionData.roomId),
        idioma: String(sessionData.language || '').trim(),
        preco: Number(sessionData.price) || 0,
        formato: String(sessionData.format || '').trim()
      };
      
      // Só adicionar dataHora se tiver valor válido e no formato ISO
      if (sessionData.dateTime && sessionData.dateTime.trim() !== '') {
        try {
          const date = new Date(sessionData.dateTime);
          if (!isNaN(date.getTime())) {
            mappedData.dataHora = date.toISOString(); // Formato ISO completo
          }
        } catch (dateError) {
          console.warn('Data inválida, ignorando:', sessionData.dateTime);
        }
      }
      
      const response = await fetch(`${this.baseURL}/session`, {
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
        throw new Error(`Error creating session: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      const result = await response.json();
      return result;

    } catch (error) {
      console.error('SessionService.create error:', error);
      throw error;
    }
  }

  async update(id, sessionData) {
    try {
      // Mapeamento para português conforme o DTO
      const mappedData = {
        movie_id: Number(sessionData.movieId),
        room_id: Number(sessionData.roomId),
        idioma: String(sessionData.language || '').trim(),
        preco: Number(sessionData.price) || 0,
        formato: String(sessionData.format || '').trim()
      };
      
      // Só adicionar dataHora se tiver valor válido e no formato ISO
      if (sessionData.dateTime && sessionData.dateTime.trim() !== '') {
        try {
          const date = new Date(sessionData.dateTime);
          if (!isNaN(date.getTime())) {
            mappedData.dataHora = date.toISOString(); // Formato ISO completo
          }
        } catch (dateError) {
          console.warn('Data inválida, ignorando:', sessionData.dateTime);
        }
      }
      
      const response = await fetch(`${this.baseURL}/session/${id}`, {
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
        throw new Error(`Error updating session: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('SessionService.update error:', error);
      throw error;
    }
  }

  async remove(id) {
    try {
      const response = await fetch(`${this.baseURL}/session/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error removing session: ${response.status} ${response.statusText}`);
      }
      
      // Tentar fazer JSON, mas se falhar, retornar sucesso
      try {
        return await response.json();
      } catch (jsonError) {
        // Se não conseguir fazer JSON (resposta vazia), considerar sucesso
        return { message: 'Session deleted successfully', success: true };
      }
    } catch (error) {
      console.error('SessionService.remove error:', error);
      throw error;
    }
  }
}

export default new SessionService();