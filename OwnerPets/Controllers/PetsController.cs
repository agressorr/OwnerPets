using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using OwnerPets.DB;

namespace OwnerPets.Controllers
{
    public class PetsController : ApiController
    {
        private PetsDBEntities db = new PetsDBEntities();

        // GET: api/Pets
        public IQueryable<Pets> GetPets()
        {
            return db.Pets;
        }

        //// GET: api/Pets/5
        //[ResponseType(typeof(Pets))]
        //public IHttpActionResult GetPets(long id)
        //{
        //    Pets pets = db.Pets.Find(id);
        //    if (pets == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(pets);
        //}

        // GET Pets by OwnerId: api/Pets/5
        [ResponseType(typeof(Pets))]
        public IQueryable<Pets> GetPets(long id)
        {
            return db.Pets.Where(r => r.OwnerId == id);
        }


        // PUT: api/Pets/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPets(long id, Pets pets)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pets.id)
            {
                return BadRequest();
            }

            db.Entry(pets).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PetsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Pets
        [ResponseType(typeof(Pets))]
        public IHttpActionResult PostPets(Pets pets)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Pets.Add(pets);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = pets.id }, pets);
        }

        // DELETE: api/Pets/5
        [ResponseType(typeof(Pets))]
        public IHttpActionResult DeletePets(long id)
        {
            Pets pets = db.Pets.Find(id);
            if (pets == null)
            {
                return NotFound();
            }

            db.Pets.Remove(pets);
            db.SaveChanges();

            return Ok(pets);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PetsExists(long id)
        {
            return db.Pets.Count(e => e.id == id) > 0;
        }
    }
}