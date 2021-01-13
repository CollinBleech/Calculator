using Microsoft.AspNetCore.Mvc;
using System;

namespace Calculator.Controllers
{
    [ApiController]
    public class Calculator : ControllerBase
    {
        [HttpGet]
        [Route("api/[controller]/{query}")]
        public ActionResult Evaluate(string query)
        {
            var expression = System.Net.WebUtility.UrlDecode(query);
            try
            {
                return Ok( new { Result = EvaluateExpression.Evaluate(expression), Error="" });
            }
            catch (DivideByZeroException e)
            {
                return Ok(new { Result = 0, Error = "Can't divide by zero." });
            }
            catch (Exception e)
            {
                return Ok(new { Result = 0, Error = "Syntax error." });
            }
        }
    }
}
