package ifba.gestor_projetos.classes;

import java.time.LocalDateTime;

public class Aviso 
{
    protected int codAviso; //Gerado automaticamente no banco de dados
    protected int projeto;
    protected long remetente;
    protected LocalDateTime publicacao;
    protected String aviso;

    public Aviso(long remetente, String aviso) {
        this.remetente = remetente;
        this.aviso = aviso;
    }

    public void setProjeto(int projeto) {
        this.projeto = projeto;
    }    

    public void setCodAviso(int codAviso) {
        this.codAviso = codAviso;
    }

    public void setPublicacao(LocalDateTime publicacao) {
        this.publicacao = publicacao;
    }

    public int getCodAviso() {
        return codAviso;
    }    

    public int getProjeto() {
        return projeto;
    }

    public long getRemetente() {
        return remetente;
    }

    public LocalDateTime getPublicacao() {
        return publicacao;
    }

    public String getAviso() {
        return aviso;
    }
}