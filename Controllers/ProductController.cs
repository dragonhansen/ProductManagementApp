using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace ProductManagementApp.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : ControllerBase
{
    [HttpGet("{pageNumber:int}")]
    public JsonResult Get(int pageNumber)
    {
        SqliteConnection connection =  new SqliteConnection("Data Source=product_db.db");
        connection.Open();
        return ReadData(connection, pageNumber);
    }

    private JsonResult ReadData(SqliteConnection conn, int pageNumber)
      {
         int start = pageNumber*10 + 1;
         int end = start+10;
         SqliteDataReader sqliteDataReader;
         SqliteCommand sqliteCmd;
         sqliteCmd = conn.CreateCommand();
         sqliteCmd.CommandText = $"SELECT * FROM Item WHERE ProductID BETWEEN {start} AND {end}";

         sqliteDataReader = sqliteCmd.ExecuteReader();
         ProductModel[] products = new ProductModel[10];
         int i = 0;
         while (i < 10 && sqliteDataReader.Read())
         {
            int productID = sqliteDataReader.GetInt32(0);
            string productName = sqliteDataReader.GetString(1);
            string productDescription = sqliteDataReader.GetString(2);
            int productPrice = sqliteDataReader.GetInt32(3);
            ProductModel item = new ProductModel{ProductId=productID, ProductName=productName, ProductDescription=productDescription, ProductPrice=productPrice};
            products[i] = item;
            i++;
         }
         bool hasMoreProductsToRead = sqliteDataReader.Read();
         conn.Close();
         return new JsonResult(new { products, hasMoreProductsToRead });
      }
}
