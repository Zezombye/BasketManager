using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication6
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] jours = new string[] { "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche" };
            System.Diagnostics.Process.Start("https://youtu.be/zJDoCPYybYY?t=79");
            System.Threading.Thread.Sleep(1100);
            for (int i = 0; i < jours.Length; i++)
            {
                Console.WriteLine(jours[i]);
                System.Threading.Thread.Sleep(1050);
            }
            for (int i = 0; i < jours.Length; i++)
            {
                Console.WriteLine(jours[i]);
                System.Threading.Thread.Sleep(1000);
            }
           
        }
    }
}
