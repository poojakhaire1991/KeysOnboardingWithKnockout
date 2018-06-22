using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.Entity;
using KeysOnboardingWithKnockout.Models;

namespace KeysOnboardingWithKnockout.Controllers
{
    public class CustomersController : Controller
    {
        KeysOnboardingEntities db = new KeysOnboardingEntities();
        // GET: Customers
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult List()
        {
            using (db)
            {
                var customer = db.Customers.Select(x => new
                {
                    x.Id,
                    x.Name,
                    x.Address,
                    x.Age,
                    x.ContactNo
                }).ToList();
                return Json(customer, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Get(int id)
        {
            var customer = db.Customers.Find(id);
            return Json(customer, JsonRequestBehavior.AllowGet);
        }
        [HttpPut]
        public ActionResult Edit(int id, Customer cust)
        {
            using (db)
            {
                db.Entry(cust).State = EntityState.Modified;
                db.SaveChanges();
                return Json(cust, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Delete(int id)
        {
            using (db)
            {
                var m = db.ProductSolds.Where(x => x.CustomerId == id).FirstOrDefault();
                if (m != null) { db.ProductSolds.Remove(m); }
                var cust = db.Customers.ToList().Find(x => x.Id == id);
                db.Customers.Attach(cust);
                db.Customers.Remove(cust);
                db.SaveChanges();
                return Json(cust, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult Create(Customer cust)
        {
            using (db)
            {
                db.Customers.Attach(cust);
                db.Customers.Add(cust);
                db.SaveChanges();
                return Json(cust, JsonRequestBehavior.AllowGet);
            }
        }
    }
}