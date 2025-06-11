import React, { useState, useEffect } from 'react';
import { Sala } from "../../../models/sala";
import BlankLayout from "../../../components/layouts/blank";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/inputs/Input";
import { useNavigate, useParams } from 'react-router-dom';

export default function RoomForm() {
    const [capacity, setCapacity] = useState('');
    const [type, setType] = useState('comum');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { salaId } = useParams();
    const isEditing = Boolean(salaId);

    // useEffect para carregar dados da sala se estiver editando
    useEffect(() => {
        if (isEditing) {
            loadRoom();
        }
    }, [salaId, isEditing]);

    const loadRoom = async () => {
        try {
            setLoading(true);
            setError(null);
            const sala = await Sala.getById(salaId);
            
            if (sala) {
                setCapacity(sala.capacity.toString());
                setType(sala.type);
            } else {
                alert('Sala não encontrada!');
                navigate('/salas');
            }
        } catch (error) {
            console.error('Erro ao carregar sala:', error);
            setError('Erro ao carregar dados da sala.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/salas');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validação básica
        if (!capacity || !type) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (parseInt(capacity) <= 0) {
            alert('A capacidade deve ser maior que 0.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const sala = new Sala(
                isEditing ? parseInt(salaId) : null,
                parseInt(capacity),
                type
            );

            await sala.save();

            alert(isEditing ? 'Sala atualizada com sucesso!' : 'Sala cadastrada com sucesso!');
            navigate('/salas');
            
        } catch (error) {
            console.error('Erro ao salvar sala:', error);
            setError('Erro ao salvar sala. Tente novamente.');
            alert('Erro ao salvar sala. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <BlankLayout>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p>Carregando dados da sala...</p>
                </div>
            </BlankLayout>
        );
    }

    if (error) {
        return (
            <BlankLayout>
                <div className="alert alert-danger" role="alert">
                    {error}
                    <button 
                        className="btn btn-outline-danger ms-2" 
                        onClick={isEditing ? loadRoom : () => setError(null)}
                    >
                        Tentar Novamente
                    </button>
                </div>
            </BlankLayout>
        );
    }

    return (
        <BlankLayout>
            <div className="card">
                <div className="card-header text-center">
                    <h1 className="mt-5">
                        {isEditing ? 'Editar Sala' : 'Cadastro de Salas'}
                    </h1>
                </div>

                <form id="salaForm" className="mt-4" onSubmit={handleSubmit}>
                    <div className="card-body">
                        <Input
                            id="capacity"
                            tipo="number"
                            label="Capacidade"
                            valor={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                            obrigatorio={true}
                            min="1"
                            max="500"
                            placeholder="Ex: 150"
                        />

                        <div className="mb-3">
                            <label htmlFor="type" className="form-label">Tipo da Sala *</label>
                            <select 
                                className="form-control" 
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <option value="comum">2D (Comum)</option>
                                <option value="3d">3D</option>
                                <option value="imax">IMAX</option>
                            </select>
                            <small className="form-text text-muted">
                                Selecione o tipo de sala conforme os recursos disponíveis
                            </small>
                        </div>

                    </div>

                    <div className="card-footer text-end">
                        <div className="d-flex justify-content-between align-items-center">
                            <Button
                                text="Voltar"
                                variant="light"
                                onClick={handleBack}
                                icone="arrow-left"
                                disabled={loading}
                            />
                            <Button
                                text={loading ? 'Salvando...' : (isEditing ? 'Atualizar Sala' : 'Cadastrar Sala')}
                                variant="success"
                                type="submit"
                                icone="save"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </BlankLayout>            
    );
}