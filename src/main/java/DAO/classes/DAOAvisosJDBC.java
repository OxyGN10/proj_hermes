/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package DAO.classes;

import DAO.interfaces.DAOAvisos;
import DAO.classes.DAOGenerico;
import ifba.gestor_projetos.classes.Aviso;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

/**
 *
 * @author gn10.lipe
 */
public class DAOAvisosJDBC implements DAOAvisos
{

    @Override
    public int inserir(Aviso aviso) {
        StringBuilder insert = new StringBuilder();
        
        insert.append("INSERT INTO AVISOS (PROJETO, REMETENTE, AVISO")
                .append("VALUES (?, ?, ?)");
        
        int linha = 0;
        
        try {
            linha = DAOGenerico.executarComando(insert.toString(), aviso.getProjeto(), aviso.getRemetente(), aviso.getAviso());
        }
        catch (Exception err) {
            err.printStackTrace();
        }
           
        return linha;        
    }

    @Override
    public List<Aviso> listar(int projeto) {
        ResultSet rset;
        List<Aviso> avisos = new ArrayList<>();
        
        try {
            rset = DAOGenerico.executarConsulta("SELECT * FROM AVISOS WHERE PROJETO = ?", projeto);
            
            while(rset.next()) {
                Aviso aviso = new Aviso(rset.getLong("remetente"), rset.getString("aviso"));
                aviso.setCodAviso(rset.getInt("cod_aviso"));
                aviso.setPublicacao(rset.getObject("publicacao", LocalDateTime.class));
            }
        }
        catch (Exception err) {
            err.printStackTrace();
        }        
        
        return avisos;
    }
    
}
