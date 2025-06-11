import RoomService from '../services/RoomService.js';

export class Sala {
  constructor(id, capacity, type) {
    this.id = id;
    this.capacity = capacity;
    this.type = type;
  }

  async save() {
    try {
      const roomData = {
        capacity: this.capacity,
        type: this.type
      };

      if (this.id) {
        const updated = await RoomService.update(this.id, roomData);
        return new Sala(updated.id, updated.capacidade, updated.tipo);
      } else {
        const created = await RoomService.create(roomData);
        this.id = created.id;
        return new Sala(created.id, created.capacidade, created.tipo);
      }
    } catch (error) {
      console.error('Error saving room:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const rooms = await RoomService.findAll();
      return rooms.map(r => new Sala(r.id, r.capacidade, r.tipo));
    } catch (error) {
      console.error('Error fetching all rooms:', error);
      return [];
    }
  }
  
  static async getById(id) {
    try {
      const room = await RoomService.findOne(id);
      if (!room) return null;
      
      return new Sala(room.id, room.capacidade, room.tipo);
    } catch (error) {
      console.error('Error fetching room by id:', error);
      throw error; // Throw error para ser capturado no form
    }
  }
  
  static async delete(id) {
    try {
      const result = await RoomService.remove(id);
      return true;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error; // Throw error para melhor tratamento
    }
  }

  async delete() {
    try {
      if (this.id) {
        await RoomService.remove(this.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting room instance:', error);
      throw error;
    }
  }

  validate() {
    const errors = [];
    
    if (!this.capacity || this.capacity <= 0) {
      errors.push('Capacity must be greater than 0');
    }
    
    if (!this.type || this.type.trim().length === 0) {
      errors.push('Type is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      capacity: this.capacity,
      type: this.type
    };
  }
}