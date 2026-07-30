package DAO.classes;

import DAO.interfaces.DAOProjetos;
import java.sql.*;
import ifba.gestor_projetos.classes.Projeto;
import ifba.gestor_projetos.enums.CompEstado;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class DAOProjetosJDBC implements DAOProjetos
{

    @Override
    public int inserir(Projeto proj) {
        StringBuilder insert = new StringBuilder();
        insert
            .append("INSERT INTO projetos (titulo, tipo)")
            .append("VALUES (?, ?)");
        
        int linha = 0;
        
        try {
            linha = DAOGenerico.executarComando(insert.toString(), proj.getTitulo(), proj.getTipo().toString());
        }
        catch (Exception err) {
            err.printStackTrace();
        }
        
        return linha;
    }

    @Override
    public int editar(Projeto proj) {
        StringBuilder update = new StringBuilder();
        update
            .append("UPDATE projetos SET")
            .append("fim = ?")
            .append("WHERE cod_proj = ?");
        
        int linha = 0;
        
        try {
            linha = DAOGenerico.executarComando(update.toString(), proj.getConclusao(), proj.getNumproj());
        }
        catch (Exception err) {
            err.printStackTrace();
        }
           
        return linha;        
    }

    @Override
    public int apagar(int cod_proj) {
        StringBuilder update = new StringBuilder();
        update
                .append("DELETE * FROM projetos")
                .append("WHERE cod_proj = ?");
        
        int linha = 0;
        
        try {
            linha = DAOGenerico.executarComando(update.toString(), cod_proj);
        }
        catch(Exception err) {
            err.printStackTrace();
        }
        
        return linha;
    }

    @Override
    public List<Projeto> listar() {
        ResultSet rset;
        List projetos = new ArrayList<Projeto>();
        StringBuilder select = new StringBuilder();
        select.append("SELECT * FROM proj_lista");
        
        try {
            rset = DAOGenerico.executarConsulta(select.toString());
            
            while(rset.next()) {
                Projeto projeto = new Projeto(rset.getString("titulo_projeto"), rset.getString("tipo_projeto"), rset.getObject("inicio_projeto", LocalDate.class));
                projeto.setNumproj(rset.getInt("cod_proj"));
                projeto.cadastro_componente(rset.getLong("lattes_id"), rset.getString("nome_componente"), rset.getString("funcao"), rset.getString("estado"), rset.getObject("entrada", LocalDate.class));
                
                projetos.add(projeto);
            }
        }
        catch(Exception err) {
            err.printStackTrace();
        }
 
        return projetos;
    }    
}
