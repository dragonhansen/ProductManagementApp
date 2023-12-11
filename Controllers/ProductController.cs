using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace ProductManagementApp.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : ControllerBase
{
   SqliteConnection connection = new SqliteConnection("Data Source=product_db.db");

   Dictionary<int, string> SortingMap = new Dictionary<int, string>() { { 0, "ProductPrice" }, { 1, "ProductName" }, { 2, "ProductID" } };

   [HttpGet("{sorting:int}/{pageNumber:int}/{filter}/{min:int?}/{max:int?}")]
   public JsonResult Get(int pageNumber, int sorting, string filter , int min, int max)
   {
      connection.Open();
      return ReadData(connection, pageNumber, sorting, filter, min, max);
   }

   private JsonResult ReadData(SqliteConnection conn, int pageNumber, int sorting, string filter, int min = -1, int max = -1)
   {
      int start = pageNumber * 10;
      SqliteDataReader sqliteDataReader;
      SqliteCommand sqliteCmd = conn.CreateCommand();
      string sortingOrder;
      SortingMap.TryGetValue(sorting, out sortingOrder);
      
      sqliteCmd.CommandText = "SELECT * FROM Product ";

      Console.WriteLine($"{filter}, {min} {max}");

      if(min != -1 && max != -1) {
         sqliteCmd.CommandText += $"WHERE {filter} BETWEEN {min} AND {max} ";
      } else if (min != -1) {
         sqliteCmd.CommandText += $"WHERE {filter} >= {min} ";
      }
      else if (max != -1) {
         sqliteCmd.CommandText += $"WHERE {filter} <= {max} ";
      }

      sqliteCmd.CommandText += $"ORDER BY {sortingOrder} LIMIT 11 OFFSET {start}";

      sqliteDataReader = sqliteCmd.ExecuteReader();
      ProductModel[] products = new ProductModel[10];
      int i = 0;
      while (i < 10 && sqliteDataReader.Read())
      {
         int productID = sqliteDataReader.GetInt32(0);
         string productName = sqliteDataReader.GetString(1);
         string productDescription = sqliteDataReader.GetString(2);
         int productPrice = sqliteDataReader.GetInt32(3);
         ProductModel product = new ProductModel { ProductId = productID, ProductName = productName, ProductDescription = productDescription, ProductPrice = productPrice };
         products[i] = product;
         i++;
      }
      bool hasMoreProductsToRead = sqliteDataReader.Read();
      conn.Close();
      return new JsonResult(new { products, hasMoreProductsToRead });
   }

   [HttpPost()]
   public IActionResult ProcessFormData([FromBody] ProductModel productToAdd) {
      connection.Open();
      SqliteCommand sqliteCmd = connection.CreateCommand();
      sqliteCmd.CommandText = $"INSERT INTO Product VALUES ({productToAdd.ProductId}, '{productToAdd.ProductName}', '{productToAdd.ProductDescription}', {productToAdd.ProductPrice})";
      try {
         sqliteCmd.ExecuteNonQuery();
         return Ok();
      }
      catch(SqliteException e) {
         Console.WriteLine($"Error: could not insert product due to {e.Message}, arborting...");
         return Conflict();
      }
      finally {
         connection.Close();
      }
   }
}
