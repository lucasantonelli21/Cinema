import MovieService from '../services/MovieService.js';

export class Filme {
    constructor(id, title, synopsis, genre, rating, duration, releaseDate, imageUrl) {
        this.id = id;
        this.title = title;
        this.synopsis = synopsis;
        this.genre = genre;
        this.rating = rating;
        this.duration = duration;
        this.releaseDate = releaseDate;
        this.imageUrl = imageUrl || '/assets/filme.jpg';
    }

    async save() {
        try {
            const movieData = {
                title: this.title,
                synopsis: this.synopsis,
                genre: this.genre,
                rating: this.rating,
                duration: this.duration,
                releaseDate: this.releaseDate,
                imageUrl: this.imageUrl
            };

            if (this.id) {
                const updated = await MovieService.update(this.id, movieData);
                return new Filme(
                    updated.id, updated.titulo, updated.sinopse, updated.genero,
                    updated.classificacao, updated.duracao, updated.dataEstreia, updated.imagemUrl
                );
            } else {
                const created = await MovieService.create(movieData);
                this.id = created.id;
                return new Filme(
                    created.id, created.titulo, created.sinopse, created.genero,
                    created.classificacao, created.duracao, created.dataEstreia, created.imagemUrl
                );
            }
        } catch (error) {
            console.error('Error saving movie:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const movies = await MovieService.findAll();
            return movies.map(m => new Filme(
                m.id, m.titulo, m.sinopse, m.genero, m.classificacao,
                m.duracao, m.dataEstreia, m.imagemUrl
            ));
        } catch (error) {
            console.error('Error fetching all movies:', error);
            return [];
        }
    }
    
    static async getById(id) {
        try {
            const movie = await MovieService.findOne(id);''
            if (!movie) return null;
            
            return new Filme(
                movie.id, movie.titulo, movie.sinopse, movie.genero,
                movie.classificacao, movie.duracao, movie.dataEstreia, movie.imagemUrl
            );
        } catch (error) {
            console.error('Error fetching movie by id:', error);
            return null;
        }
    }
    
    static async delete(id) {
        try {
            await MovieService.remove(id);
            return true;
        } catch (error) {
            console.error('Error deleting movie:', error);
            return false;
        }
    }

    async delete() {
        try {
            if (this.id) {
                await MovieService.remove(this.id);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting movie instance:', error);
            return false;
        }
    }

    // Método para validação
    validate() {
        const errors = [];
        
        if (!this.title || this.title.trim().length === 0) {
            errors.push('Title is required');
        }
        
        if (!this.genre || this.genre.trim().length === 0) {
            errors.push('Genre is required');
        }
        
        if (!this.duration || this.duration <= 0) {
            errors.push('Duration must be greater than 0');
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
            title: this.title,
            synopsis: this.synopsis,
            genre: this.genre,
            rating: this.rating,
            duration: this.duration,
            releaseDate: this.releaseDate,
            imageUrl: this.imageUrl
        };
    }
}