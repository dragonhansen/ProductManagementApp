using System.Diagnostics;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace ProductManagementApp.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductController : ControllerBase
{
   SqliteConnection connection = new SqliteConnection("Data Source=product_db.db");

   [HttpGet("{sortingOrder}/{pageNumber:int}/{filter}/{min:int}/{max:int}")]
   public IActionResult Get(int pageNumber, string sortingOrder, string filter , int min, int max)
   {
      connection.Open();
      int start = pageNumber * 10;
      SqliteDataReader sqliteDataReader;
      SqliteCommand sqliteCmd = connection.CreateCommand();
      
      sqliteCmd.CommandText = "SELECT * FROM Product ";
      sqliteCmd.Parameters.AddWithValue("@filter", filter);
      sqliteCmd.Parameters.AddWithValue("@min", min);
      sqliteCmd.Parameters.AddWithValue("@max", max);

      if(min != -1 && max != -1) {
         sqliteCmd.CommandText += $"WHERE {filter} BETWEEN @min AND @max ";
      } else if (min != -1) {
         sqliteCmd.CommandText += $"WHERE {filter} >= @min ";
      }
      else if (max != -1) {
         sqliteCmd.CommandText += $"WHERE {filter} <= @max ";
      }

      sqliteCmd.Parameters.AddWithValue("@start", start);
      sqliteCmd.CommandText += $"ORDER BY {sortingOrder} LIMIT 11 OFFSET @start";

      try {
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
         connection.Close();
         return new JsonResult(new { products, hasMoreProductsToRead });
      }
      catch (SqliteException e) {
         Console.WriteLine($"Error: could not read from database: {e.Message}, arborting...");
         return StatusCode(500);
      }
   }

   [HttpPost("add-product")]
   public IActionResult AddProduct([FromBody] ProductModel productToAdd) {
      connection.Open();
      SqliteCommand sqliteCmd = connection.CreateCommand();
      sqliteCmd.CommandText = "INSERT INTO Product VALUES (@ProductID, @ProductName, @ProductDescription, @ProductPrice)";
      sqliteCmd.Parameters.AddWithValue("@ProductID", productToAdd.ProductId);
      sqliteCmd.Parameters.AddWithValue("@ProductName", productToAdd.ProductName);
      sqliteCmd.Parameters.AddWithValue("@ProductDescription", productToAdd.ProductDescription);
      sqliteCmd.Parameters.AddWithValue("@ProductPrice", productToAdd.ProductPrice);
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

   [HttpPost("edit-product")]
   public IActionResult EditProduct([FromBody] ProductModel updatedProduct) {
      connection.Open();
      SqliteCommand sqliteCmd = connection.CreateCommand();
      sqliteCmd.CommandText = "UPDATE Product SET ProductName = @ProductName, ProductDescription = @ProductDescription, ProductPrice = @ProductPrice WHERE ProductID = @ProductID";
      sqliteCmd.Parameters.AddWithValue("@ProductName", updatedProduct.ProductName);
      sqliteCmd.Parameters.AddWithValue("@ProductDescription", updatedProduct.ProductDescription);
      sqliteCmd.Parameters.AddWithValue("@ProductPrice", updatedProduct.ProductPrice);
      sqliteCmd.Parameters.AddWithValue("@ProductID", updatedProduct.ProductId);
         try {
         int rowsInserted = sqliteCmd.ExecuteNonQuery();
         if (rowsInserted == 0) {
            return NotFound();
         }
         return Ok();

      }
      catch(SqliteException e) {
         Console.WriteLine($"Error: could not update product due to {e.Message}, arborting...");
         return Conflict();
      }
      finally {
         connection.Close();
      }
   }
}
