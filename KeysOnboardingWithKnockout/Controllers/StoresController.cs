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
    public class StoresController : Controller
    {
        KeysOnboardingEntities db = new KeysOnboardingEntities();
        // GET: Stores
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult List()
        {
            using (db)
            {
                var store = db.Stores.Select(x => new
                {
                    Id=x.Id,
                    Name=x.Name,
                    Address=x.Address,
                    ContactNo=x.ContactNo
                }).ToList();
                return Json(store, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Get(int id)
        {
            var store = db.Stores.Find(id);
            return Json(store, JsonRequestBehavior.AllowGet);
        }
        [HttpPut]
        public ActionResult Edit(int id, Store store)
        {
            using (db)
            {
                db.Entry(store).State = EntityState.Modified;
                db.SaveChanges();
                return Json(store, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult Delete(int id)
        {
            using (db)
            {
                var m = db.ProductSolds.Where(x => x.StoreId == id).FirstOrDefault();
                if (m != null) { db.ProductSolds.Remove(m); }
                var store = db.Stores.ToList().Find(x => x.Id == id);
                db.Stores.Attach(store);
                db.Stores.Remove(store);
                db.SaveChanges();
                return Json(store, JsonRequestBehavior.AllowGet);
            }

        }
        public JsonResult Create(Store store)
        {
            using (db)
            {
                db.Stores.Attach(store);
                db.Stores.Add(store);
                db.SaveChanges();
                return Json(store, JsonRequestBehavior.AllowGet);
            }
        }
    }
}