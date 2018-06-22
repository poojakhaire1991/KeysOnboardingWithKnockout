using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using KeysOnboardingWithKnockout.Models;
using System.Data.Entity;
using System.Data;

namespace KeysOnboardingWithAjax.Controllers
{
    public class ProductsController : Controller
    {
        KeysOnboardingEntities db = new KeysOnboardingEntities();
        // GET: Products
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult List()
        {
            using (db)
            {
                var prod = db.Products.Select(x => new
                {
                     x.Id,
                     x.Name,
                     x.Price
                }).ToList();
                return Json(prod, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPut]
        public ActionResult Edit(int id, Product prod)
        {
            using (db)
            {
                db.Entry(prod).State = EntityState.Modified;
                db.SaveChanges();
                return Json(prod, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Delete(int id)
        {
            using (db)
            {
                var m = db.ProductSolds.Where(x => x.ProductId == id).FirstOrDefault();
                if (m != null) { db.ProductSolds.Remove(m); }
                var prod1 = db.Products.ToList().Find(x => x.Id == id);
                db.Products.Attach(prod1);
                db.Products.Remove(prod1);
                db.SaveChanges();
                return Json(prod1, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult Create(Product prod)
        {
            using (db)
            {
                db.Products.Attach(prod);
                db.Products.Add(prod);
                db.SaveChanges();
                return Json(prod, JsonRequestBehavior.AllowGet);
            }
        }
    }
}