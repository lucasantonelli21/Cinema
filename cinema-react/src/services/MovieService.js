class MovieService {
  constructor() {
    this.baseURL = 'http://localhost:3000';
  }

  async findAll() {
    try {
      const response = await fetch(`${this.baseURL}/movie`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching movies: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MovieService.findAll error:', error);
      throw error;
    }
  }

  async findOne(id) {
    try {
      const response = await fetch(`${this.baseURL}/movie/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching movie: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MovieService.findOne error:', error);
      throw error;
    }
  }

  async create(movieData) {
    try {
      
      const mappedData = {
        titulo: String(movieData.title || '').trim(),
        sinopse: String(movieData.synopsis || '').trim(),
        genero: String(movieData.genre || '').trim(),
        classificacao: Number(movieData.rating) || 0,
        duracao: Number(movieData.duration) || 0,
        imagemUrl: String(movieData.imageUrl || '').trim()
      };
      
      // Validar se os campos obrigatórios não estão vazios
      if (!mappedData.titulo) {
        throw new Error('Título é obrigatório');
      }
      if (!mappedData.sinopse || mappedData.sinopse.length < 10) {
        throw new Error('Sinopse deve ter pelo menos 10 caracteres');
      }
      if (!mappedData.genero) {
        throw new Error('Gênero é obrigatório');
      }
      if (!mappedData.imagemUrl) {
        throw new Error('URL da imagem é obrigatória');
      }
      
      // Só adicionar dataEstreia se tiver valor válido - formato ISO completo
      if (movieData.releaseDate && movieData.releaseDate.trim() !== '') {
        try {
          const date = new Date(movieData.releaseDate);
          if (!isNaN(date.getTime())) {
            mappedData.dataEstreia = date.toISOString(); // Formato completo: 2002-08-30T00:00:00.000Z
          }
        } catch (dateError) {
          console.warn('Data inválida, ignorando:', movieData.releaseDate);
        }
      }
      
      const response = await fetch(`${this.baseURL}/movie`, {
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
        throw new Error(`Error creating movie: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('MovieService.create error:', error);
      throw error;
    }
  }

  async update(id, movieData) {
    try {
      const mappedData = {
        titulo: String(movieData.title || '').trim(),
        sinopse: String(movieData.synopsis || '').trim(),
        genero: String(movieData.genre || '').trim(),
        classificacao: Number(movieData.rating) || 0,
        duracao: Number(movieData.duration) || 0,
        imagemUrl: String(movieData.imageUrl || '').trim()
      };

      const response = await fetch(`${this.baseURL}/movie/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Error updating movie: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('MovieService.update error:', error);
      throw error;
    }
  }

  async remove(id) {
    try {
      const response = await fetch(`${this.baseURL}/movie/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error removing movie: ${response.status} ${response.statusText}`);
      }
      
      // Verificar se há conteúdo na resposta antes de tentar fazer JSON
      const contentType = response.headers.get('content-type');
      const hasContent = response.headers.get('content-length') !== '0';
      
      if (contentType && contentType.includes('application/json') && hasContent) {
        return await response.json();
      } else {
        // Se não há JSON, retornar objeto de sucesso simples
        return { message: 'Movie deleted successfully', success: true };
      }
    } catch (error) {
      console.error('MovieService.remove error:', error);
      throw error;
    }
  }
}

export default new MovieService();