using System;
using System.Collections.Generic;

namespace Calculator
{
    public class EvaluateExpression
    {
        // Converts expressions from infix notation to postfix notation using two stacks to compute the result
        public static double Evaluate(string expression)
        {
            var values = new Stack<double>();
            var operations = new Stack<char>();

            for (int i = 0; i < expression.Length; i++)
            {
                // Current char is either a number or start of a decimal
                if (expression[i] == '.' || expression[i] >= '0' && expression[i] <= '9')
                {
                    var n = "";

                    // Read until current char is no longer a decimal or number
                    while (i < expression.Length && (expression[i] == '.' || expression[i] >= '0' && expression[i] <= '9'))
                        n += expression[i++];
                    values.Push(double.Parse(n));

                    // Current char wasn't a number so back i up
                    i--;
                }
                // Opening parentheses
                else if (expression[i] == '(')
                {
                    operations.Push(expression[i]);
                }
                // Closing parentheses, solve up until the opening brace
                else if (expression[i] == ')')
                {
                    while (operations.Peek() != '(')
                        values.Push(Compute(operations.Pop(), values.Pop(), values.Pop()));
                    operations.Pop();
                }
                // Operator
                else if (new List<char>() { 'p', '-', '*', '/' }.Contains(expression[i]))
                {
                    // Runs while top operator has same or greater precedence to current operator
                    while (operations.Count > 0 && HasPrecedence(expression[i], operations.Peek()))
                        values.Push(Compute(operations.Pop(), values.Pop(), values.Pop()));
                    operations.Push(expression[i]);
                }
            }

            // Expression has been parsed, apply remaining operations to the remaining values
            while (operations.Count > 0)
                values.Push(Compute(operations.Pop(), values.Pop(), values.Pop()));

            return values.Pop();
        }

        // Computes a and b based on the operator
        private static double Compute(char operation, double b, double a)
        {
            switch (operation)
            {
                case 'p':
                    return a + b;
                case '-':
                    return a - b;
                case '*':
                    return a * b;
                case '/':
                    if (b == 0)
                        throw new System.DivideByZeroException();
                    return a / b;
            }
            return 0;
        }

        // returns true if op2 has higher or same precedence
        private static bool HasPrecedence(char op1, char op2)
        {
            if (op2 == '(' || op2 == ')')
                return false;
            if ((op1 == '*' || op1 == '/') && (op2 == 'p' || op2 == '-'))
                return false;

            return true;
        }
    }
}