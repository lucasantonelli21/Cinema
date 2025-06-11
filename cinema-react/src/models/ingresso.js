import TicketService from '../services/TicketService.js';

export class Ingresso {
    constructor(id, sessionId, cpf, seat, paymentMethod) {
        this.id = id;
        this.sessionId = sessionId;
        this.cpf = cpf;
        this.seat = seat;
        this.paymentMethod = paymentMethod;
        this.purchaseDate = new Date().toISOString();
    }

    // Método para salvar o ingresso
    async save() {
        try {
            const ticketData = {
                sessionId: this.sessionId,
                cpf: this.cpf,
                seat: this.seat,
                paymentMethod: this.paymentMethod
            };

            if (this.id) {
                // Atualizar ingresso existente
                const updated = await TicketService.update(this.id, ticketData);
                return new Ingresso(
                    updated.id, updated.session_id, updated.cpf, updated.assento, updated.formaPagamento
                );
            } else {
                // Criar novo ingresso
                const created = await TicketService.create(ticketData);
                this.id = created.id;
                return new Ingresso(
                    created.id, created.session_id, created.cpf, created.assento, created.formaPagamento
                );
            }
        } catch (error) {
            console.error('Error saving ticket:', error);
            throw error;
        }
    }

    // Método estático para buscar todos os ingressos
    static async getAll() {
        try {
            const tickets = await TicketService.findAll();
            return tickets.map(t => new Ingresso(
                t.id, t.session_id, t.cpf, t.assento, t.formaPagamento
            ));
        } catch (error) {
            console.error('Error fetching all tickets:', error);
            return [];
        }
    }
    
    // Método para buscar ingresso por ID
    static async getById(id) {
        try {
            const ticket = await TicketService.findOne(id);
            if (!ticket) return null;
            
            return new Ingresso(
                ticket.id, ticket.session_id, ticket.cpf, ticket.assento, ticket.formaPagamento
            );
        } catch (error) {
            console.error('Error fetching ticket by id:', error);
            throw error; // Throw error para ser capturado no form
        }
    }
    
    // Método para excluir ingresso
    static async delete(id) {
        try {
            const result = await TicketService.remove(id);
            return true;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error; // Throw error para melhor tratamento
        }
    }

    // Método de instância para excluir
    async delete() {
        try {
            if (this.id) {
                await TicketService.remove(this.id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting ticket instance:', error);
            throw error;
        }
    }
    
    // Verificar se um assento já está ocupado para uma determinada sessão
    static async isSeatTaken(sessionId, seat) {
        try {
            const tickets = await Ingresso.getAll();
            return tickets.some(
                ticket => ticket.sessionId === parseInt(sessionId) && 
                         ticket.seat.toLowerCase() === seat.toLowerCase()
            );
        } catch (error) {
            console.error('Error checking seat availability:', error);
            return false;
        }
    }

    static async getBySession(sessionId) {
        try {
            const tickets = await Ingresso.getAll();
            return tickets.filter(ticket => ticket.sessionId === parseInt(sessionId));
        } catch (error) {
            console.error('Error fetching tickets by session:', error);
            return [];
        }
    }

    // Método para validação
    validate() {
        const errors = [];
        
        if (!this.sessionId) {
            errors.push('Session ID is required');
        }
        
        if (!this.cpf || this.cpf.trim().length === 0) {
            errors.push('CPF is required');
        }
        
        if (!this.seat || this.seat.trim().length === 0) {
            errors.push('Seat is required');
        }
        
        if (!this.paymentMethod || this.paymentMethod.trim().length === 0) {
            errors.push('Payment method is required');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Método para conversão para JSON
    toJSON() {
        return {
            id: this.id,
            sessionId: this.sessionId,
            cpf: this.cpf,
            seat: this.seat,
            paymentMethod: this.paymentMethod,
            purchaseDate: this.purchaseDate
        };
    }

    // Métodos utilitários
    getFormattedCpf() {
        return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    getFormattedPurchaseDate() {
        return new Date(this.purchaseDate).toLocaleDateString('pt-BR');
    }
}