import React from "react";
import Button from "../buttons/Button";

export default function Table({title, onAdd, children}) {
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <div className="d-flex">
                        <div className="col">
                            <h2>
                                <i className="fa-solid fa-database me-2"></i>
                                {title}
                            </h2>
                        </div>
                        
                        <div className="card-buttons">
                            <Button
                                text="Adicionar"
                                variant="primary"
                                onClick={onAdd}
                                icone="plus"
                            />
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {children}
                </div>
                <div className="card-footer"></div>
            </div>    
        </>
    );
}
