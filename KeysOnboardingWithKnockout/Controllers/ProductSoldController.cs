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
    public class ProductSoldController : Controller
    {
        KeysOnboardingEntities db = new KeysOnboardingEntities();
        // GET: ProductSold
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult List()
        {
            using (db)
            {
                var psold = new ProductSold();
                ViewBag.CustomerId = new SelectList(db.Customers, "Id", "Name", psold.CustomerId);
                ViewBag.ProductId = new SelectList(db.Products, "Id", "Name", psold.ProductId);
                ViewBag.StoreId = new SelectList(db.Stores, "Id", "Name", psold.StoreId);
                var product = db.ProductSolds.Include(c => c.Customer).Include(p => p.Product).Include(s => s.Store).Select(x => new {
                    Id = x.Id,
                    CustomerId = x.CustomerId,
                    Customer = x.Customer.Name,
                    ProductId = x.ProductId,
                    Product = x.Product.Name,
                    StoreId = x.StoreId,
                    Store = x.Store.Name,
                    DateSold = x.DateSold
                }).ToList();
                return Json(product, JsonRequestBehavior.AllowGet);
            }                
        }
        public JsonResult Add(ProductSold prod)
        {
            using (db)
            {
                db.ProductSolds.Add(prod);
                db.SaveChanges();
                return Json(prod, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Edit(int id,ProductSold prod)
        {
            using(db)
            {
                var prod1=db.ProductSolds.Find(id);
                if (prod1 != null) {
                    db.Entry(prod1).State = EntityState.Detached;
                }
                db.Entry(prod).State = EntityState.Modified;
                db.SaveChanges();
                return Json(prod, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Delete(int id)
        {
            using (db)
            {
                ProductSold prod = db.ProductSolds.Find(id);
                db.ProductSolds.Remove(prod);
                db.SaveChanges();
                return Json(prod, JsonRequestBehavior.AllowGet);
            }                
        }
    }
}