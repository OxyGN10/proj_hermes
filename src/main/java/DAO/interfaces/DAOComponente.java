/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package DAO.interfaces;
import ifba.gestor_projetos.classes.Componente;
import java.util.List;

public interface DAOComponente 
{
    public int[] inserir(Componente comp);
    public int editar(Componente comp);
    public List<Componente> listar(int projeto);
}
