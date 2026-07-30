package DAO.interfaces;
import java.util.List;
import ifba.gestor_projetos.classes.Projeto;

public interface DAOProjetos 
{
    public int inserir(Projeto proj);
    public int editar(Projeto proj);
    public int apagar(int cod_proj);
    public List<Projeto> listar();
}
