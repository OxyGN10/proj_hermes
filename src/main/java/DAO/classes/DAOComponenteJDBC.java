
package DAO.classes;

import DAO.interfaces.DAOComponente;
import ifba.gestor_projetos.classes.Componente;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author gn10.lipe
 */
public class DAOComponenteJDBC implements DAOComponente
{   
    @Override
    public int[] inserir(Componente comp) {
        StringBuilder insert1 = new StringBuilder();
        StringBuilder insert2 = new StringBuilder();
        
        insert1.append("INSERT INTO COMPONENTES")
                .append("VALUES (?, ?)");
        
        insert2.append("INSERT INTO COMP_PROJ(projeto, componente, funcao, estado, entrada)")
                .append("VALUES (?, ?, ?, ?)");
        
        int[] linhas = {0 , 0};
        
        try {
            linhas[0] = DAOGenerico.executarComando(insert1.toString(), comp.getLattesId(), comp.getNome());
            linhas[1] = DAOGenerico.executarComando(insert2.toString(), comp.getProjeto(), comp.getLattesId(), comp.getFuncao(), comp.getEstado().toString(), comp.getEntrada());
        }
        catch(Exception err) {
            err.printStackTrace();
        }
        
        return linhas;
    }
    
    @Override
    public int editar(Componente comp) {
        StringBuilder update = new StringBuilder();
        
        update.append("UPDATE COMP_PROJ")
                .append("SET (ESTADO = ?, SAIDA = ?)")
                .append("WHERE LATTES_ID = ?");
        
        int linha = 0;
        
        try {
            linha = DAOGenerico.executarComando(update.toString(), comp.getEstado().toString(), comp.getSaida(), comp.getLattesId());
        }
        catch(Exception err) {
            err.printStackTrace();
        }
        
        return linha;            
    }
    
    @Override
    public List<Componente> listar(int projeto) {
        List<Componente> componentes = new ArrayList<>();
        ResultSet rset;
   
        try {
            rset = DAOGenerico.executarConsulta("SELECT * FROM COMP_DATA");
            
            while(rset.next()) {
                Componente componente = new Componente(rset.getLong("lattes_id"), rset.getString("nome"), rset.getString("funcao"), rset.getString("estado"), rset.getObject("entrada", LocalDate.class));
                componente.setProjeto(rset.getInt("projeto"));
                LocalDate saida = rset.getObject("saida", LocalDate.class);
                
                if(saida != null) {
                    componente.setSaida(saida);
                }
                
                componentes.add(componente);
            }
        }
        catch(Exception err) {
            err.printStackTrace();
        }
        
        return componentes;
    }
}
