package ifba.gestor_projetos.classes;

import java.time.LocalDate;
import java.util.ArrayList;
import ifba.gestor_projetos.enums.Tipos;
import ifba.gestor_projetos.enums.CompEstado;

public class Projeto 
{
    protected int numProj; //Gerado automaticamente no banco de dados
    protected String titulo;
    protected Tipos tipo;
    protected ArrayList<Componente> componentes = new ArrayList<>();
    protected ArrayList<Aviso> avisos = new ArrayList<>();
    //protected ArrayList<Atividade> atividades = new ArrayList<>();
    protected LocalDate inicio;
    protected LocalDate conclusao;
    
    public void cadastro_componente(long lattesId, String nome, String funcao, String estado, LocalDate entrada) {
        try {
            this.componentes.add(new Componente(lattesId, nome, funcao, estado, entrada));
        }
        catch(IllegalArgumentException err) {
            System.out.println("Erro: " + err.getMessage());
        }
    }
    
    public void novoAviso(int lattesId, String aviso) {
        if(lattesId != -255) {
            Componente remetente = this.buscaComp(lattesId);
            
            if(remetente.getEstado() == CompEstado.desligado)
                throw new IllegalArgumentException("Componentes desligados não podem emitir aviso!");
            
            this.avisos.add(new Aviso(lattesId, aviso));
        }
        else if(lattesId == -255)
            this.avisos.add(new Aviso(lattesId, aviso));
        //Lattes ID -255 é reservado para os avisos do sistema
    }
    
    /*public void novaAtividade(String atividade, LocalDate inicio, LocalDate fim) {
        this.atividades.add(new Atividade(atividade, inicio, fim, false));
    }*/
    
    public void desligarComp(int lattesId) {
        for(Componente componente : this.componentes) {
            if(componente.getLattesId() == lattesId) {
                componente.setEstado("desligado");
                break;
            }
        }
    }
    
    private Componente buscaComp(int lattesId) {
        for(Componente componente : this.componentes) {
            if(componente.getLattesId() == lattesId)
                return componente;
        }
        
        throw new IllegalArgumentException("Componente não encontrado!");
    }

    public Projeto(String titulo, String tipo, LocalDate inicio) {
        this.titulo = titulo;
        this.tipo = Tipos.valueOf(tipo);
        this.inicio = inicio;
    }
    
    public void setNumproj(int codigo) {
        this.numProj = codigo;
    }
    
    public void setConclusao(LocalDate data) {
        this.conclusao = data;
    }

    public ArrayList<Componente> getComponentes() {
        return this.componentes;
    }
    
    public Componente getLider() {
        for(Componente componente : this.componentes) {
            if(componente.getFuncao().equals("lider"))
                return componente;
        }
        return null;
    }

    public ArrayList<Aviso> getAvisos() {
        return this.avisos;
    }

    /*public ArrayList<Atividade> getAtividades() {
        return this.atividades;
    }*/
    
    public int getNumproj() {
        return this.numProj;
    }

    public String getTitulo() {
        return this.titulo;
    }

    public Tipos getTipo() {
        return this.tipo;
    }    
    
    public LocalDate getInicio() {
        return this.inicio;
    }
    
    public LocalDate getConclusao() {
        return this.conclusao;
    }
}