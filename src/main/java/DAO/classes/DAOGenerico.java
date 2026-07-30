package DAO.classes;

import java.sql.*;

public abstract class DAOGenerico 
{
    public static Connection getConexao() throws SQLException, ClassNotFoundException {
        String USUARIO = "appusr";
        String SENHA = "#PgUsr1";
        String URL_BANCO = "jdbc:postgresql://localhost:5432/sisproj";
        //Faz com que a classe seja carregada pela JVM
        Class.forName("org.postgresql.Driver");

        return DriverManager.getConnection(URL_BANCO, USUARIO, SENHA);
    }
    
    public static int executarComando(String query, Object... params) throws SQLException, ClassNotFoundException {
        PreparedStatement sql = (PreparedStatement)  getConexao().prepareStatement(query);
        for (int i = 0; i < params.length; i++) {
            sql.setObject(i+1,params[i]);
        }
        int result = sql.executeUpdate();
        sql.close();
        return result;
    }

    public static ResultSet executarConsulta(String query, Object... params) throws SQLException, ClassNotFoundException {
        PreparedStatement sql = (PreparedStatement)  getConexao().prepareStatement(query);
        for (int i = 0; i < params.length; i++) {
            sql.setObject(i+1,params[i]);
        }
        return sql.executeQuery();
    }    
}
