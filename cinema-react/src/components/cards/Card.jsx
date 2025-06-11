import Button from '../buttons/Button'
import ButtonLink from '../buttons/ButtonLink';

function Card(
    {
        titulo,
        descricao,
        imagem,
        botaoLink,
        rodape
    }
){
    return(
        <>
            <div className="card" style={{ width: '18rem' }}>
                { imagem && <img src={imagem} className="card-img-top"/>}
                
                <div className="card-body">
                    <h5 className="card-title"> {titulo} </h5>
                    <p className="card-text small"> {descricao} </p>
                    
                    
                        <ButtonLink
                            texto = {botaoLink.texto}
                            cor = {botaoLink.cor}
                            tamanho={botaoLink.tamanho}
                            href = {botaoLink.href}
                        />
                </div>

                { rodape && <div className="card-footer text-muted"> {rodape} </div> }
            </div>

        </>
    );
}

export default Card