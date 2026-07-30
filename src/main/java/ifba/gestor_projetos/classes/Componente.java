package ifba.gestor_projetos.classes;

import java.time.LocalDate;
import ifba.gestor_projetos.enums.CompEstado;

public class Componente 
{
    protected long lattesId;
    protected String nome;
    protected int projeto;
    protected String funcao;
    protected LocalDate entrada;
    protected LocalDate saida; 
    protected CompEstado estado;
    
    public void setNome (String nome) {
        if(nome.length() > 128)
            throw new IllegalArgumentException("O nome não pode ultrapassar 128 caracteres");
        
        this.nome = nome;
    }
    
    public void setEstado(String estado) {        
        this.estado = CompEstado.valueOf(estado);
    }
    
    public void setSaida(LocalDate saida) {
        this.saida = saida;
    }
    
    public void setLattesId(long lattesId) {
        if(lattesId < 0)
            throw new IllegalArgumentException("Id Lattes incorreto!");
        
        this.lattesId = lattesId;
    }
    
    public void setProjeto(int projeto) {
        this.projeto = projeto;
    }

    public Componente(long lattesId, String nome, String funcao, String estado, LocalDate entrada) {
        this.funcao = funcao;
        this.entrada = entrada;
        
        this.setNome(nome);
        this.setEstado(estado);
        this.setLattesId(lattesId);
    }

    public long getLattesId() {
        return lattesId;
    }

    public String getNome() {
        return nome;
    }

    public String getFuncao() {
        return funcao;
    }

    public LocalDate getEntrada() {
        return entrada;
    }

    public LocalDate getSaida() {
        return saida;
    }

    public CompEstado getEstado() {
        return estado;
    }
    
    public int getProjeto() {
        return this.projeto;
    }
}
