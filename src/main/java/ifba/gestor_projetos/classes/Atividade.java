package ifba.gestor_projetos.classes;

import java.time.LocalDate;
import ifba.gestor_projetos.enums.Situacao;

public class Atividade 
{
    //protected int codAtividade; //Gerado automaticamente pelo banco de dados
    protected String atividade;
    protected Situacao situcao;
    protected LocalDate inicio;
    protected LocalDate fim;
    
    public void setSituacao(boolean concluida) {
        LocalDate hoje = LocalDate.now();
        
        if(concluida == true)
            this.situcao = Situacao.concluida;
        else if(hoje.isAfter(this.fim))
            this.situcao = Situacao.em_atraso;           
        else if(hoje.isBefore(this.inicio))
            this.situcao = Situacao.pendente;
        else
            this.situcao = Situacao.em_andamento;
    }
    
    public Atividade(String atividade, LocalDate inicio, LocalDate fim, boolean concluida) {
        this.atividade = atividade;
        this.inicio = inicio;
        this.fim = fim;
        
        this.setSituacao(concluida);
    }

    public String getAtividade() {
        return atividade;
    }

    public Situacao getSitucao() {
        return situcao;
    }

    public LocalDate getInicio() {
        return inicio;
    }

    public LocalDate getFim() {
        return fim;
    }    
}
