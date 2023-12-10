using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace ProductManagementApp.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : ControllerBase
{
    [HttpGet]
    public ProductModel[] Get()
    {
        SqliteConnection connection =  new SqliteConnection("Data Source=product_db.db");
        connection.Open();
        return ReadData(connection);
    }

    private ProductModel[] ReadData(SqliteConnection conn)
      {
         SqliteDataReader sqliteDataReader;
         SqliteCommand sqliteCmd;
         sqliteCmd = conn.CreateCommand();
         sqliteCmd.CommandText = "SELECT * FROM Item";

         sqliteDataReader = sqliteCmd.ExecuteReader();
         ProductModel[] products = new ProductModel[35];
         int i = 0;
         while (sqliteDataReader.Read())
         {
            int productID = sqliteDataReader.GetInt32(0);
            string productName = sqliteDataReader.GetString(1);
            string productDescription = sqliteDataReader.GetString(2);
            Console.WriteLine(productName);
            ProductModel item = new ProductModel{ProductId=productID, ProductName=productName, ProductDescription=productDescription};
            products[i] = item;
            i++;
         }
         conn.Close();
         return products;
      }
}
