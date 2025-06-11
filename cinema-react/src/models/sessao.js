import SessionService from '../services/SessionService.js';

export class Sessao {
    constructor(id, movieId, roomId, dateTime, language, price, format) {
        this.id = id;
        this.movieId = movieId;
        this.roomId = roomId;
        this.dateTime = dateTime;
        this.language = language;
        this.price = price;
        this.format = format;
    }

    async save() {
        try {
            const sessionData = {
                movieId: this.movieId,
                roomId: this.roomId,
                dateTime: this.dateTime,
                language: this.language,
                price: this.price,
                format: this.format
            };

            if (this.id) {
                const updated = await SessionService.update(this.id, sessionData);
                return new Sessao(
                    updated.id, updated.movie_id, updated.room_id, updated.dataHora,
                    updated.idioma, updated.preco, updated.formato
                );
            } else {
                const created = await SessionService.create(sessionData);
                this.id = created.id;
                return new Sessao(
                    created.id, created.movie_id, created.room_id, created.dataHora,
                    created.idioma, created.preco, created.formato
                );
            }
        } catch (error) {
            console.error('Error saving session:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const sessions = await SessionService.findAll();
            return sessions.map(s => new Sessao(
                s.id, s.movie_id, s.room_id, s.dataHora, s.idioma, s.preco, s.formato
            ));
        } catch (error) {
            console.error('Error fetching all sessions:', error);
            return [];
        }
    }
    
    static async getById(id) {
        try {
            const session = await SessionService.findOne(id);
            if (!session) return null;
            
            return new Sessao(
                session.id, session.movie_id, session.room_id, session.dataHora,
                session.idioma, session.preco, session.formato
            );
        } catch (error) {
            console.error('Error fetching session by id:', error);
            throw error; // Throw error para ser capturado no form
        }
    }

    static async delete(id) {
        try {
            const result = await SessionService.remove(id);
            return true;
        } catch (error) {
            console.error('Error deleting session:', error);
            throw error; // Throw error para melhor tratamento
        }
    }

    async delete() {
        try {
            if (this.id) {
                await SessionService.remove(this.id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting session instance:', error);
            throw error;
        }
    }

    validate() {
        const errors = [];
        
        if (!this.movieId) {
            errors.push('Movie ID is required');
        }
        
        if (!this.roomId) {
            errors.push('Room ID is required');
        }
        
        if (!this.dateTime) {
            errors.push('Date and time is required');
        }
        
        if (!this.price || this.price <= 0) {
            errors.push('Price must be greater than 0');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toJSON() {
        return {
            id: this.id,
            movieId: this.movieId,
            roomId: this.roomId,
            dateTime: this.dateTime,
            language: this.language,
            price: this.price,
            format: this.format
        };
    }

    getFormattedDate() {
        return new Date(this.dateTime).toLocaleDateString('pt-BR');
    }

    getFormattedTime() {
        return new Date(this.dateTime).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    getFormattedPrice() {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(this.price);
    }
}